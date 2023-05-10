class PromptResolver:
    def __init__(self):
        self.phrase_to_intent = {
            "count": ["how many", "number of", "count"],
            "description": ["what", "which"],
        }
        self.phrase_to_subject = {
            "playlist": ["playlists", "playlist"],
            "artist": ["artists", "artist"],
        }
        self.subject_intent_to_action = [
            ("playlist", "description", "current_user_playlists"),
            ("artist", "description", "current_user_followed_artists"),
            ("playlist", "count", "current_user_playlists"),
            ("artist", "count", "current_user_followed_artists"),
        ]

    def _tokenise_prompt(self, prompt):
        print("tokenisation: ", prompt.lower().split(" "))
        return prompt.lower().split(" ")

    def resolve_prompt(self, prompt: str):
        # assumption for v1:
        # prompts are short
        # prompts contain just a single intent and subject

        resolved_subject_intent = []

        subject = None
        intent = None
        for token in self._tokenise_prompt(prompt):
            for s, p in self.phrase_to_subject.items():
                if token in p:
                    subject = s
            for i, p in self.phrase_to_intent.items():
                if token in p:
                    intent = i

        # print(subject, intent)
        if subject is not None and intent is not None:
            resolved_subject_intent.append(subject)
            resolved_subject_intent.append(intent)
            return resolved_subject_intent
        else:
            return False

    def action_on_prompt(self, resolved_intent_subject):
        for sia in self.subject_intent_to_action:
            if (
                sia[0] == resolved_intent_subject[0]
                and sia[1] == resolved_intent_subject[1]
            ):
                return sia[2]

        return False
