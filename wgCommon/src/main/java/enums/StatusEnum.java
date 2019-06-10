package enums;

/**
 * @author huangwh
 * @date 2019/6/10
 * @time 11:01
 */
public enum  StatusEnum {

    YES(1,"是"),NO(0,"否");

    private Integer code;
    private String desc;

    StatusEnum(Integer code,String desc){
        this.desc = desc;
        this.code = code;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }
}
