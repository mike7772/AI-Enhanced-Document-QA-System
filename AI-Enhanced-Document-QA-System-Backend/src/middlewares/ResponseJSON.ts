class ResponseJSON {
    constructor(
      msg: string,
      error: boolean = false,
      statusCode: number,
      data?: any
    ) {
      if (data)
        Object.keys(data).forEach((k) => {
          data[k] == null && delete data[k];
          (k == "password") && delete data[k];
        });
      return { msg, error, statusCode, data };
    }
  }
  
  export default ResponseJSON;