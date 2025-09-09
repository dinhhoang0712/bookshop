package vn.vuhoang.backend_springboot.service;

import jakarta.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.vuhoang.backend_springboot.constant.Message;
import vn.vuhoang.backend_springboot.constant.RoleEnum;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqUpdateImgDTO;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqUserDTO;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqUserUpdateDTO;
import vn.vuhoang.backend_springboot.domain.dto.request.ResetPasswordDTO;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqChangePasswordDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.*;
import vn.vuhoang.backend_springboot.domain.entity.User;
import vn.vuhoang.backend_springboot.exception.InvalidException;
import vn.vuhoang.backend_springboot.exception.RuntimeStorageException;
import vn.vuhoang.backend_springboot.mapper.UserMapper;
import vn.vuhoang.backend_springboot.repository.UserRepository;

import vn.vuhoang.backend_springboot.utils.FilterUtils;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final EmailService emailService;
    private final RedisService redisService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            EmailService emailService, UserMapper userMapper, RedisService redisService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.userMapper = userMapper;
        this.redisService = redisService;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public ResultPaginationDTO getAllUsers(Pageable pageable, Map<String, String> params) {

        Page<User> users = userRepository.findAll(FilterUtils.buildSpecificationFromParams(params), pageable);

        return ResultPaginationDTO.builder()
                .meta(Meta.builder()
                        .page(users.getNumber() + 1)
                        .pageSize(users.getSize())
                        .pages(users.getTotalPages())
                        .total(users.getTotalElements())
                        .build())
                .result(userMapper.toDto(users.getContent())).build();
    }

    @Transactional(rollbackOn = Exception.class)
    public ResUserDTO createUser(ReqUserDTO reqUserDTO) throws InvalidException {
        if (userRepository.existsByEmail(reqUserDTO.getEmail()))
            throw new InvalidException("Email đã tồn tại");

        User user = userMapper.toEntity(reqUserDTO);

        user.setPassword(passwordEncoder.encode(reqUserDTO.getPassword()));
        user.setRole(RoleEnum.USER);
        user.setCreatedAt(Instant.now());

        User savedUser = userRepository.save(user);

        try {
            String token = UUID.randomUUID().toString();
            emailService.emailVarification(savedUser.getEmail(), savedUser.getFullName(), token);
            redisService.setValue(token, savedUser.getEmail(), 60 * 24 * 30L);
        } catch (IOException e) {
            throw new RuntimeStorageException("Email chưa được xác thực", e);
        }

        return userMapper.toDto(savedUser);
    }

    public ResUserDTO updateUser(Long id, ReqUserUpdateDTO dto) throws InvalidException {
        User user = userRepository.findById(id).orElseThrow(() -> new InvalidException("Id không tồn tại"));

        User newUser = userMapper.partialUpdate(dto, user);
        newUser.setUpdatedAt(Instant.now());

        return userMapper.toDto(userRepository.save(newUser));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public ResUserDTO getUserById(Long id) throws InvalidException {
        User user = userRepository.findById(id).orElseThrow(() -> new InvalidException("Id không tồn tại"));

        return userMapper.toDto(user);
    }

    public ResListUserDTO bulkCreateUser(List<ReqUserDTO> listDto) {
        List<String> errors = new ArrayList<>();
        List<User> validUsers = new ArrayList<>();

        for (ReqUserDTO dto : listDto) {
            processUserDto(dto, errors, validUsers);
        }

        List<User> savedUsers = validUsers.isEmpty() ? new ArrayList<>() : userRepository.saveAll(validUsers);

        return ResListUserDTO.builder()
                .countSuccess((long) savedUsers.size())
                .countError((long) errors.size())
                .detail(errors.isEmpty() ? "OK" : errors)
                .build();
    }

    public void changePassword(ReqChangePasswordDTO resChangePassword) throws InvalidException {
        String email = JwtService.getCurrentUserLogin()
                .orElseThrow(() -> new InvalidException(Message.EMAIL_NOT_EXIST));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidException(Message.EMAIL_NOT_EXIST));
        if (!passwordEncoder.matches(resChangePassword.getCurrentPassword(), user.getPassword())) {
            throw new InvalidException("Mật khẩu không đúng");
        }
        user.setPassword(passwordEncoder.encode(resChangePassword.getNewPassword()));
        userRepository.save(user);
    }

    public void updateImg(ReqUpdateImgDTO updateImgDTO) throws InvalidException {
        User user = userRepository.findById(updateImgDTO.getId()).orElseThrow(
                () -> new InvalidException(Message.EMAIL_NOT_EXIST));
        user.setPhone(updateImgDTO.getPhone());
        user.setUpdatedAt(Instant.now());
        user.setFullName(updateImgDTO.getFullName());
        user.setAvatar(updateImgDTO.getImg());

        userRepository.save(user);
    }

    private void processUserDto(ReqUserDTO dto, List<String> errors, List<User> validUsers) {
        String email = dto.getEmail();

        String error = validateDto(dto);
        if (error != null) {
            errors.add(error);
            return;
        }

        try {
            if (userRepository.existsByEmail(email)) {
                errors.add("Email đã tồn tại: " + email);
                return;
            }

            User user = userMapper.toEntity(dto);
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
            user.setRole(RoleEnum.USER);
            user.setCreatedAt(Instant.now());

            validUsers.add(user);
        } catch (Exception e) {
            errors.add("Lỗi khi xử lý user có email " +
                    (email == null || email.isEmpty() ? "<không có email>" : email) +
                    ": " + e.getMessage());
        }
    }

    private String validateDto(ReqUserDTO dto) {
        String email = dto.getEmail();
        String fullName = dto.getFullName();
        String password = dto.getPassword();

        if (email == null || email.trim().isEmpty()) {
            return "Email không được bỏ trống";
        }

        String emailRegex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        if (!email.matches(emailRegex)) {
            return "Email không hợp lệ: " + email;
        }

        if (fullName == null || fullName.trim().isEmpty()) {
            return "Tên không được để trống cho email: " + email;
        }

        if (password == null || password.trim().isEmpty()) {
            return "Mật khẩu không được bỏ trống cho email: " + email;
        }

        return null; // No validation errors
    }

    public String resetPassword(ResetPasswordDTO resetPasswordDTO) throws InvalidException {
        User user = userRepository.findByEmail(resetPasswordDTO.getEmail())
                .orElseThrow(() -> new InvalidException("Email không tồn tại"));
        if (user.getPassword().equals(resetPasswordDTO.getNewPassword())) {
            throw new InvalidException("Mật khẩu mới không được trùng với mật khẩu cũ");
        }
        user.setPassword(passwordEncoder.encode(resetPasswordDTO.getNewPassword()));
        userRepository.save(user);
        return "Mật khẩu đã được cập nhật thành công";
    }
}
