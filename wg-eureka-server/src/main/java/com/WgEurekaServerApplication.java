package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@SpringBootApplication
@EnableEurekaServer
public class WgEurekaServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(WgEurekaServerApplication.class, args);
	}

	//2.1.3.RELEASE以上版本需要配置，否则加密码时客户端无法访问
	@EnableWebSecurity
	static class WebSecurityConfig extends WebSecurityConfigurerAdapter {
		@Override
		protected void configure(HttpSecurity http) throws Exception {
			http.csrf().disable().authorizeRequests()
					.anyRequest()
					.authenticated()
					.and()
					.httpBasic();
		}
	}
}
