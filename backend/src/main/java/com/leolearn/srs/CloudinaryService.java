package com.leolearn.srs;

import java.io.IOException;
import java.util.Map;
import java.util.HashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService() {
        String url = System.getenv("CLOUDINARY_URL");
        if (url != null && !url.isBlank()) {
            this.cloudinary = new Cloudinary(url);
        } else {
            Map<String, String> config = new HashMap<>();
            config.put("cloud_name", System.getenv("CLOUDINARY_CLOUD_NAME"));
            config.put("api_key", System.getenv("CLOUDINARY_API_KEY"));
            config.put("api_secret", System.getenv("CLOUDINARY_API_SECRET"));
            this.cloudinary = new Cloudinary(config);
        }
    }

    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        try {
            Map<?,?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }
}