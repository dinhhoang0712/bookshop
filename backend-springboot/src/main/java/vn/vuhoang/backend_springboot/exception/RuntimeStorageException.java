package vn.vuhoang.backend_springboot.exception;

public class RuntimeStorageException extends RuntimeException {
    public RuntimeStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
