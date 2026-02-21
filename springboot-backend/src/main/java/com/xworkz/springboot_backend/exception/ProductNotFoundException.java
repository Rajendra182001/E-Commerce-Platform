package com.xworkz.springboot_backend.exception;

public class ProductNotFoundException extends RuntimeException{

    public  ProductNotFoundException(String message){

        super(message);
    }
}
