from rest_framework import serializers
from .models import Document
import mimetypes


class DocumentSerializer(serializers.ModelSerializer):
    file_name = serializers.SerializerMethodField()
    fileUrl = serializers.SerializerMethodField()
    file_size = serializers.SerializerMethodField()
    file_type = serializers.SerializerMethodField()
    createdBy = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Document
        # fields = [
        #     "id",
        #     "title",
        #     "description",
        #     "documentType",
        #     "fileUrl",
        #     "version",
        #     "status",
        #     "createdBy",
        #     "createdAt",
        # ]
        fields = "__all__"
        read_only_fields = ("user", "status")

    def get_file_name(self, obj):
        return obj.file.name.split("/")[-1]
    
    def get_fileUrl(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.file.url)
    
    def get_file_size(self, obj):
        return obj.file.size if obj.file else None
    
    def get_file_type(self, obj):
        return mimetypes.guess_type(obj.file.name)[0]
    
    def get_createdBy(self, obj):
        return {
            "id": obj.createdBy.id,
            "username": obj.createdBy.username,
            "role": obj.createdBy.role,
        }
