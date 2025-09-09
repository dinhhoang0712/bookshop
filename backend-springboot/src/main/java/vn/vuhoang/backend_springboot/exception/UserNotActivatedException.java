package vn.vuhoang.backend_springboot.exception;

public class UserNotActivatedException extends RuntimeException{
    public UserNotActivatedException(String message) {
        super(message);
    }
}
