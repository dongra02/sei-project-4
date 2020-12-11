from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import chat_messages.routing

import os
import django

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
# django.setup()

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter(
            chat_messages.routing.websocket_urlpatterns
        )
    ),
})