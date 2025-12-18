package com.example.Tech.Events.service;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import org.checkerframework.checker.units.qual.A;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class OtpService {

    private final Cache<String, String> otpCache;

    public OtpService() {

        // Initialize the cache to expire entries 5 minutes after they are written
        otpCache = CacheBuilder.newBuilder()
                .expireAfterWrite(5, TimeUnit.MINUTES)
                .build();
    }

    public String generateOtp(String key) {
        Random random = new Random();
        String otp = String.format("%06d", random.nextInt(1000000));
        otpCache.put(key, otp);
        return otp;
    }

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