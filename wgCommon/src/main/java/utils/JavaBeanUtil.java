package utils;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author huangwh
 * @date 2019/6/1
 * @time 14:30
 */
public class JavaBeanUtil {

    public static Map<String,Object> convertBeanToMap(Object bean) throws IntrospectionException,IllegalAccessException, InvocationTargetException {
        Class type = bean.getClass();
        Map<String,Object> returnMap = new HashMap<>();
        BeanInfo beanInfo = Introspector.getBeanInfo(type);
        PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
        for (int i = 0; i < propertyDescriptors.length; i++) {
            PropertyDescriptor descriptor = propertyDescriptors[i];
            String propertyName = descriptor.getName();
            if (!propertyName.equals("class")) {
                Method readMethod = descriptor.getReadMethod();
                Object result = readMethod.invoke(bean, new Object[0]);
                if (result != null) {
                    returnMap.put(propertyName, result);
                } else {
                    returnMap.put(propertyName, "");
                }
            }
        }
        return returnMap;
    }

    public static List<Map<String,Object>> convertBeanToMapList(List beans) throws IntrospectionException,IllegalAccessException, InvocationTargetException{
        List<Map<String,Object>> result = new ArrayList<>();
        for(Object bean : beans){
            result.add(convertBeanToMap(bean));
        }
        return result;
    }
}
