package com.example.app.controller;

import org.springframework.core.io.Resource;
import org.apache.coyote.Response;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class ImageController {
    private final Path imageLocation = Paths.get("assets/images/");

    @GetMapping("/images/{imageName}")
    public ResponseEntity<Resource> getImage(@PathVariable String imageName){

        try{
            Path imagePath = imageLocation.resolve(imageName).normalize();
            Resource resource = new UrlResource(imagePath.toUri());

            if (!resource.exists() || !resource.isReadable()){
                throw new RuntimeException("Cant read a file");
            }
            String contentType = "image/jpeg";

            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        }
        catch (Exception e){
            throw new RuntimeException("Could not find the image!", e);
        }
    }
}
