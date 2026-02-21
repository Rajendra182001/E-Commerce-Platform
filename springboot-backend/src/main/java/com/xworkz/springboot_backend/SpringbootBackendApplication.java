package com.xworkz.springboot_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class 	SpringbootBackendApplication {

	public static void main(String[] args) {
	ConfigurableApplicationContext configurableApplicationContext = SpringApplication.run(SpringbootBackendApplication.class, args);
		System.out.println(configurableApplicationContext.getBeanDefinitionCount());
	}

}
