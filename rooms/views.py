from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied

from .models import Room
from .serializers.common import RoomSerializer
from .serializers.populated import PopulatedRoomSerializer

class RoomListView(APIView):
    ''' Handles Requests to /rooms '''

    def get(self, _request):
        room_list = Room.objects.all()
        serialized_room_list = PopulatedRoomSerializer(room_list, many=True)
        return Response(serialized_room_list.data, status=status.HTTP_200_OK)

    def post(self, request):
        room_to_create = RoomSerializer(data=request.data)
        if room_to_create.is_valid():
            room_to_create.save()
            return Response(room_to_create.data, status=status.HTTP_201_CREATED)
        return Response(room_to_create.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

class RoomDetailView(APIView):
    ''' Handles Requests to /rooms/:room_id '''

    def get_room(self, pk):
        try:
            return Room.objects.get(pk=pk)
        except Room.DoesNotExist:
            raise NotFound()

    def is_member(self, room, user):
        if user not in room.members.all():
            raise PermissionDenied()


    def get(self, request, pk):
        room = self.get_room(pk=pk)
        self.is_member(room, request.user)
        serialized_room = PopulatedRoomSerializer(room)
        return Response(serialized_room.data, status=status.HTTP_200_OK)