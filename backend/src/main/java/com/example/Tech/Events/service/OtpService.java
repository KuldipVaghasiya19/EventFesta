package com.example.Tech.Events.service;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private final Cache<String, String> otpCache;

    public OtpService() {
        // Initialize the cache to expire entries 5 minutes after they are written
        otpCache = CacheBuilder.newBuilder()
                .expireAfterWrite(5, TimeUnit.MINUTES)
                .build();
    }

    /**
     * Generates a 6-digit OTP for the given key (e.g., email) and stores it in the cache.
     *
     * @param key The identifier for the OTP (e.g., user's email).
     * @return The generated OTP.
     */
    public String generateOtp(String key) {
        Random random = new Random();
        String otp = String.format("%06d", random.nextInt(1000000));
        otpCache.put(key, otp);
        return otp;
    }

    /**
     * Validates the provided OTP against the one stored in the cache.
     *
     * @param key The identifier for the OTP (e.g., user's email).
     * @param otp The OTP provided by the user.
     * @return True if the OTP is valid, false otherwise.
     */
    public boolean validateOtp(String key, String otp) {
        String storedOtp = otpCache.getIfPresent(key);
        if (storedOtp != null && storedOtp.equals(otp)) {
            // OTP is valid, invalidate it so it can't be used again
            otpCache.invalidate(key);
            return true;
        }
        return false;
    }
}