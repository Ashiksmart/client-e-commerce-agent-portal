const NotFound = () => {
  return (
    <div class="center">
      <div class="error">
        <div class="number">4</div>
        <div class="illustration">
          <div class="circle"></div>
          <div class="clip">
            <div class="paper">
              <div class="face">
                <div class="eyes">
                  <div class="eye eye-left"></div>
                  <div class="eye eye-right"></div>
                </div>
                <div class="rosyCheeks rosyCheeks-left"></div>
                <div class="rosyCheeks rosyCheeks-right"></div>
                <div class="mouth"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="number">4</div>
      </div>

      <div className="text">
        Sorry, the page you are looking for does not exist.
      </div>
      <div style={{marginTop: 20}}>
        <div className="btn btn_lgt_primary">
          <a className="clnk" href="/">Back Home</a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
