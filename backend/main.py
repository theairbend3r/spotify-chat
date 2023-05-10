import uuid
from functools import lru_cache
from collections import defaultdict

import spotipy
from spotipy.oauth2 import SpotifyOAuth


from pydantic import BaseModel
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

import config
from prompt_resolver import PromptResolver

app = FastAPI()

origins = [
    "http://localhost:8000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


OAUTH_STATE = "".join(str(uuid.uuid4()).split("-"))
ACCESS_TOKEN = None
REFRESH_TOKEN = None


@lru_cache
def get_settings():
    return config.Settings()


settings = get_settings()
prompt_resolver = PromptResolver()

AUTH_MANAGER = SpotifyOAuth(
    client_id=settings.client_id,
    client_secret=settings.client_secret,
    redirect_uri=settings.redirect_uri,
    scope=[
        "user-read-email",
        "user-top-read",
        "user-follow-read",
        "playlist-read-private",
        "playlist-read-collaborative",
        "user-read-currently-playing",
    ],
    state=OAUTH_STATE,
)

# cache responses in memory for faster req-response cycle
DATA_FETCHED = defaultdict()


@app.get("/api/login")
async def login():
    auth_url = AUTH_MANAGER.get_authorize_url()

    return RedirectResponse(url=auth_url)


@app.get("/api/auth")
async def auth(request: Request):
    global ACCESS_TOKEN, REFRESH_TOKEN

    code = request.query_params["code"]
    state = request.query_params["state"]

    if state != OAUTH_STATE:
        return RedirectResponse(url="http://localhost:3000")
    else:
        auth_response = AUTH_MANAGER.get_access_token(code=code, as_dict=True)
        ACCESS_TOKEN = auth_response["access_token"]
        REFRESH_TOKEN = auth_response["refresh_token"]

        sp = spotipy.Spotify(auth_manager=AUTH_MANAGER)
        username = sp.me()["display_name"]

        return RedirectResponse(url=f"http://localhost:3000?user_name={username}")


@app.get("/api/current_user")
async def current_user():
    sp = spotipy.Spotify(auth=ACCESS_TOKEN, auth_manager=AUTH_MANAGER)
    return sp.current_user()


@app.get("/api/fetch_all")
async def fetch_all():
    global DATA_FETCHED
    sp = spotipy.Spotify(auth=ACCESS_TOKEN, auth_manager=AUTH_MANAGER)
    current_user_followed_artists = sp.current_user_followed_artists()
    current_user_playlists = sp.current_user_playlists()

    DATA_FETCHED["current_user_playlists"] = current_user_playlists
    DATA_FETCHED["current_user_followed_artists"] = current_user_followed_artists

    return {"data": "data is fetched, huzzah!"}


class Prompt(BaseModel):
    prompt: str


@app.post("/api/prompt")
async def prompt(prompt: Prompt):
    # print(DATA_FETCHED)
    pr = PromptResolver()
    resolved_intent_subject = pr.resolve_prompt(prompt.prompt)

    if resolved_intent_subject:
        action = pr.action_on_prompt(resolved_intent_subject)
        if resolved_intent_subject[1] == "description":
            return {"data": DATA_FETCHED[action]}
        elif resolved_intent_subject[1] == "count":
            return {"data": len(DATA_FETCHED[action])}
        else:
            return {
                "data": "I am sorry, I don't know the answer to that...yet. I am still learning. :)"
            }
    else:
        return {
            "data": "I am sorry, I don't know the answer to that...yet. I am still learning. :)"
        }
