from collections import defaultdict


class PromptResolver:
    """Prompt resolver.

    Attributes
    ----------
    prompt :
    """

    def __init__(self):
        self.intents = ["count", "description"]
        self.subjects = ["artists", "playlists"]
        self.phrase_to_intent = {
            "count": ["how many", "number of", "count"],
            "description": ["what", "which"],
        }
        self.subject_intent_to_action = [
            (
                "playlists",
                "count",
            )
        ]

    def _tokenise_prompt(self, prompt):
        return prompt.lower().split(" ")

    def resolve_prompt(self, prompt: str):
        # assumption for v1:
        # prompts are short
        # prompts contain just a single intent and subject

        # key: value
        # subject: intent
        resolved_intent_subject = defaultdict()

        subject = None
        intent = None
        for token in self._tokenise_prompt(prompt):
            if token in self.subjects:
                subject = token
            if token in self.intents:
                intent = token

        if subject is not None and intent is not None:
            resolved_intent_subject[subject] = intent
            return resolved_intent_subject
        else:
            return "I am sorry, I don't know the answer to that...yet. I am still learning. :)"

    def action_on_prompt(self, prompt):
        resolved_intent_subject = self.resolve_prompt(prompt)
