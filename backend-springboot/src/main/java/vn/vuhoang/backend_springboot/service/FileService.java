package vn.vuhoang.backend_springboot.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.vuhoang.backend_springboot.exception.RuntimeStorageException;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {
    @Value("${vuhoang.upload-file.base-uri}")
    private String baseUri;

    public List<String> uploadFile(String type, List<MultipartFile> fileList) throws URISyntaxException {

        creatDirectory(type);

        return fileList.stream()
                .map(m -> {
                    try {
                        return store(m, type);
                    } catch (IOException | URISyntaxException e) {
                        throw new RuntimeStorageException("Lỗi khi lưu file: " + m.getOriginalFilename(), e);
                    }
                })
                .toList();
    }

    public void creatDirectory(String folder) throws URISyntaxException {
        URI uri = new URI(baseUri + folder);
        Path path = Paths.get(uri);

        try {
            Files.createDirectories(path);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public String store(MultipartFile file, String folder) throws URISyntaxException, IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = "." + originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
        }

        String finalName = UUID.randomUUID() + extension;
        String name = baseUri + folder + "/" + finalName;
        URI uri = new URI(name);
        Path path = Paths.get(uri);
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, path,
                    StandardCopyOption.REPLACE_EXISTING);
        }
        return finalName;
    }
}
