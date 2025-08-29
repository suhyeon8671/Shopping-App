
import Header from "../components/Header";

const LoginPage = () => {
  return (
    <>
      <Header />
      <div className="container login-page-container">
        <div className="login-form-wrapper">
          <form className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input className="form-input" id="email" type="text" placeholder="Email" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input className="form-input" id="password" type="password" placeholder="******************" />
            </div>
            <div className="form-actions">
              <button className="sign-in-button" type="button">
                Sign In
              </button>
              <a className="forgot-password-link" href="#">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
