/**
 * This file created at 2016年10月18日.
 *
 * Copyright (c) 2002-2016 Bingosoft, Inc. All rights reserved.
 */
package exception;

/**
 * <code>{@link HippoException}</code>
 *
 * TODO : document me
 *
 * @author lijie
 */
public class HippoException extends RuntimeException {
	
	private static final long serialVersionUID = -6896389644432598060L;
	
	private String msg;

	/**
     * Constructor.
     * 
     * @param message
     * 			exception message.
     * 
     */
    public HippoException(final String message) {
        super(message);
    }

    /**
     * Constructor : warp a exception to {@link HippoException}
     * 
     * @param exception
     * 			wrapped exception.
     */
    public HippoException(final Exception exception) {
    	super();
    	if (null != exception) {
    		msg = exception.getMessage();
    	}
	} 
    
    /**
     * A default constructor.
     * 
     */
    public HippoException() {
		super();
	}

    /**
     * Constructor : wrap a {@link Throwable} param into {@link HippoException}.
     *
     * @param cause
     * 			wrapped Throwable param.
     *
     */
	public HippoException(Throwable cause) {
		super(cause);
	}

	/**
     * Constructor : wrap a {@link Throwable} param into {@link HippoException} using exception message.
     * 
     * @param msg
     * 			exception message.
     * 
     * @param cause
     * 			wrapped Throwable param.
     * 
     */
	public HippoException(final String msg,
                          final Throwable cause) {
		super(msg, cause);
	}

	/**
	 * Get exception message.
	 * 
	 * @return
	 * 			exception message.
	 * 
	 */
	@Override
	public String getMessage() {
		return msg == null ? super.getMessage() : msg;
	}

	/**
	 * Set exception message.
	 * 
	 * @param message
	 *            exception message.
	 *            
	 */
	public void setMessage(final String message) {
		msg = message;
	}

	/**
	 * Get String format of this {@link HippoException} .
	 * 
	 * @return
	 *				exception message.
	 *
	 */
	@Override
	public String toString() {
		return getMessage();
	}

}
