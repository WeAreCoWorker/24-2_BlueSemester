package hello.degitaleye.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

@Aspect
@Component
public class ExeTimerImpl {
    @Pointcut("@annotation(LogExecutionTime)")
    private void timer() {}

    @Around("timer()")
    public void AssumeExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        StopWatch stopWatch = new StopWatch();

        stopWatch.start();
        joinPoint.proceed(); // join point 메서드 실행
        stopWatch.stop();

        long totalTimeMillis = stopWatch.getTotalTimeMillis();
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String methodName = signature.getMethod().getName();
        System.out.println("메서드 이름 : " + methodName);
        System.out.println("수행 시간 : " + totalTimeMillis + "ms");
    }
}