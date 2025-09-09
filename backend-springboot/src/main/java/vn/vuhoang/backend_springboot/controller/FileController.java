package vn.vuhoang.backend_springboot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.vuhoang.backend_springboot.service.FileService;

import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }


        @PostMapping("/file/upload")
    public ResponseEntity<List<String>> uploadFile(@RequestHeader("upload-type") String type,
                                                   @RequestParam("fileImg") List<MultipartFile> multipartFile) throws URISyntaxException {
        return  ResponseEntity.ok(fileService.uploadFile(type, multipartFile));
    }
}
