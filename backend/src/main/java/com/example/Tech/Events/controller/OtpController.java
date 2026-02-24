package com.example.Tech.Events.controller;

import com.example.Tech.Events.constant.ApiPaths;
import com.example.Tech.Events.constant.ErrorMessages;
import com.example.Tech.Events.exception.BadRequestException;
import com.example.Tech.Events.dto.payload.ApiResponse;
import com.example.Tech.Events.service.EmailService;
import com.example.Tech.Events.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(ApiPaths.OTP)
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8080"})
public class OtpController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = otpService.generateOtp(email);
        try {
            emailService.sendOtpEmail(email, otp);
            return ResponseEntity.ok(new ApiResponse<>(true, "OTP sent successfully"));
        } catch (Exception e) {
            throw new BadRequestException(ErrorMessages.FAILED_TO_SEND_OTP);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");

        if (otpService.validateOtp(email, otp)) {
            return ResponseEntity.ok(new ApiResponse<>(true, "OTP verified successfully"));
        } else {
            throw new BadRequestException(ErrorMessages.INVALID_OTP);
        }
    }
}