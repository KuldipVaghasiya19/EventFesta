package com.example.Tech.Events.dto.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    // Overloaded constructor for responses without data
    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}