import uuid
from functools import lru_cache

import spotipy
from spotipy.oauth2 import SpotifyOAuth

from typing_extensions import Annotated
from fastapi import FastAPI, Request, Depends
from fastapi.responses import RedirectResponse

import config


app = FastAPI()

OAUTH_STATE = "".join(str(uuid.uuid4()).split("-"))
ACCESS_TOKEN = None
REFRESH_TOKEN = None


@lru_cache
def get_settings():
    print(config.Settings())
    return config.Settings()


settings = get_settings()

AUTH_MANAGER = SpotifyOAuth(
    client_id=settings.client_id,
    client_secret=settings.client_secret,
    redirect_uri=settings.redirect_uri,
    scope=["user-read-email"],
    state=OAUTH_STATE,
)


@app.get("/api/login")
async def login():
    # auth_manager = SpotifyOAuth(
    #     client_id=settings.client_id,
    #     client_secret=settings.client_secret,
    #     redirect_uri=settings.redirect_uri,
    #     scope=["user-read-email"],
    #     state=OAUTH_STATE,
    # )

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

        # try response cookies: https://fastapi.tiangolo.com/advanced/response-cookies/
        # return RedirectResponse(
        #     url=f"http://localhost:3000?access_token={ACCESS_TOKEN}&refresh_token={REFRESH_TOKEN}"
        # )
        return RedirectResponse(url=f"http://localhost:3000?user_name={username}")


@app.get("/api/current_user")
async def current_user():
    sp = spotipy.Spotify(auth=ACCESS_TOKEN, auth_manager=AUTH_MANAGER)
    return sp.current_user()
