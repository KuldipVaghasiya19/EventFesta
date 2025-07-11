package com.example.Tech.Events.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import java.awt.image.BufferedImage;
import java.util.HashMap;
import java.util.Map;

public class QrCodeGenerator {

    /**
     * Generates QR Code image for the given text
     * @param text The text to encode in QR code
     * @param width Width of the QR code image
     * @param height Height of the QR code image
     * @return BufferedImage of the QR code
     * @throws WriterException if QR code generation fails
     */
    public static BufferedImage generateQRCodeImage(String text, int width, int height) throws WriterException {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Text cannot be null or empty");
        }

        QRCodeWriter qrCodeWriter = new QRCodeWriter();

        // Set encoding hints for better QR code generation
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M);
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        hints.put(EncodeHintType.MARGIN, 1);

        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height, hints);
        return MatrixToImageWriter.toBufferedImage(bitMatrix);
    }

    /**
     * Generates QR Code image with default size (200x200)
     * @param text The text to encode in QR code
     * @return BufferedImage of the QR code
     * @throws WriterException if QR code generation fails
     */
    public static BufferedImage generateQRCodeImage(String text) throws WriterException {
        return generateQRCodeImage(text, 200, 200);
    }

    /**
     * Generates QR Code image with custom size
     * @param text The text to encode in QR code
     * @param size Size of the QR code (square)
     * @return BufferedImage of the QR code
     * @throws WriterException if QR code generation fails
     */
    public static BufferedImage generateQRCodeImage(String text, int size) throws WriterException {
        return generateQRCodeImage(text, size, size);
    }
}