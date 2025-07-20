package com.example.Tech.Events.controller;

import com.example.Tech.Events.service.EventRegistrationService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8080"})
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Autowired
    private EventRegistrationService eventRegistrationService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        logger.info("Received /create-order request with payload: {}", data);
        try {
            Object amountObj = data.get("amount");
            if (Objects.isNull(amountObj)) {
                logger.error("Error: Amount is missing from the request.");
                return ResponseEntity.badRequest().body(Map.of("error", "Amount is required."));
            }

            double amountDouble = Double.parseDouble(amountObj.toString());
            int amount = (int) (amountDouble * 100); // Convert to paise

            if (amount <= 0) {
                logger.error("Error: Amount must be greater than zero. Received: {}", amount);
                return ResponseEntity.badRequest().body(Map.of("error", "Amount must be greater than zero."));
            }

            RazorpayClient razorpayClient = new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_rcptid_" + System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequest);
//            logger.info("Razorpay order created successfully: {}", order.get("id"));
            return ResponseEntity.ok(order.toString());

        } catch (RazorpayException e) {
            logger.error("Razorpay Exception: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error creating Razorpay order: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Generic Exception in createOrder: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An unexpected server error occurred."));
        }
    }

    @PostMapping("/verify-and-register")
    public ResponseEntity<?> verifyPaymentAndRegister(@RequestBody Map<String, Object> payload) {
        String orderId = (String) payload.get("razorpay_order_id");
        String paymentId = (String) payload.get("razorpay_payment_id");
        String signature = (String) payload.get("razorpay_signature");

        if (orderId == null || paymentId == null || signature == null) {
            return ResponseEntity.badRequest().body(Map.of("status", "failure", "message", "Payment verification details are missing."));
        }

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);

            boolean isValid = Utils.verifyPaymentSignature(options, this.keySecret);

            if (isValid) {
                logger.info("Payment signature verified for orderId: {}", orderId);
                try {
                    String participantId = (String) payload.get("participantId");
                    String eventId = (String) payload.get("eventId");
                    Map<String, String> registrationFormData = (Map<String, String>) payload.get("registrationData");

                    eventRegistrationService.registerParticipantForEvent(
                            participantId,
                            eventId,
                            registrationFormData,
                            paymentId,
                            orderId
                    );

                    return ResponseEntity.ok(Map.of("status", "success", "message", "Payment successful and registration complete!"));

                } catch (Exception e) {
                    logger.error("CRITICAL: Payment {} verified but registration failed for user {}. Reason: {}", paymentId, payload.get("participantId"), e.getMessage(), e);
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of(
                                    "status", "failure_after_payment",
                                    "message", "Your payment was successful, but we couldn't complete the registration. Please contact support with Payment ID: " + paymentId
                            ));
                }
            } else {
                logger.warn("Payment verification failed for orderId: {}. Signature did not match.", orderId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("status", "failure", "message", "Payment verification failed. Signature did not match."));
            }
        } catch (RazorpayException e) {
            logger.error("Razorpay exception during verification for orderId: {}. Error: {}", orderId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("status", "failure", "message", e.getMessage()));
        }
    }
}
