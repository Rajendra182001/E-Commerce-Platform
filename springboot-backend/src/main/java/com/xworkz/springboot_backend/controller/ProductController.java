package com.xworkz.springboot_backend.controller;

import com.xworkz.springboot_backend.dto.ProductDto;
import com.xworkz.springboot_backend.service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/")
@CrossOrigin(
        origins = {
                "http://localhost:3000",
                "https://my-projects-8meohazsd-rajendra-ns-projects.vercel.app",
                "*"
        },
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}
)
public class ProductController {

    private ProductService service;

    @Autowired
    public ProductController(ProductService service){
        this.service=service;
    }
    @GetMapping("/product")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        List<ProductDto> list = service.getAllProducts();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/product/{productId}/image")
    public ResponseEntity<byte[]> getImageByProductId(@PathVariable int productId){

        ProductDto product = service.getProduct(productId);
        byte[] imageFile = product.getImageData();
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(product.getImageType()))
                .body(imageFile);
    }

    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart("productDto") ProductDto productDto,
                                        @RequestPart("multipartFile") MultipartFile multipartFile) {
        try {
            ProductDto savedProduct = service.addProduct(productDto,multipartFile);
            return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/product/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable Integer id,
                                                @RequestPart("productDto") ProductDto productDto,
                                                @RequestPart(value = "imageFile") MultipartFile imageFile) {
        try {
            ProductDto updatedProduct = service.updateProduct(id,productDto, imageFile);
            return (updatedProduct != null)
                    ? new ResponseEntity<>("Updated", HttpStatus.OK)
                    : new ResponseEntity<>("Failed to update", HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to update", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/product/{id}")
    public void deleteProduct(@PathVariable Integer id) {
         service.deleteProduct(id);
    }
}
