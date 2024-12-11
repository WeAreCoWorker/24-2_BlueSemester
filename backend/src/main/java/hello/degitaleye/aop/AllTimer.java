package hello.degitaleye.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
public class AllTimer {
 
    @Around("execution(* hello.degitaleye..*(..))")
    public Object executeTime(ProceedingJoinPoint joinPoint) throws  Throwable{
        long start = System.currentTimeMillis();
        log.info("START : {}ms " ,start);
 
        try{
            return joinPoint.proceed();
        } finally {
            long finish = System.currentTimeMillis();
            long timeMs = finish - start;
 
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            String methodName = signature.getMethod().getName();
 
            log.info("END : {} , 실행 메서드: {} ,실행시간 : {}ms", finish,methodName,timeMs);
        }
    }
}