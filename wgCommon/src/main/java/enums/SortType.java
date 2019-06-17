package enums;

/**
 * Created by lijie on 2017/2/12.
 */
public enum SortType {
    asc("asc"),desc("desc");

    private String sortTypeValue;

    private SortType(String sortTypeValue){
        this.sortTypeValue = sortTypeValue;
    }

    @Override
    public String toString() {
        return String.valueOf ( this.sortTypeValue );
    }
}
