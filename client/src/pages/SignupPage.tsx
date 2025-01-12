import React from "react";
import "../index.css"; // Import your custom CSS styles here

const SignupPage: React.FC = () => {
  return (
    <main>
      <section className="min-vh-100 d-flex bg-primary align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="card bg-primary shadow-soft border-light p-4">
                <div className="card-header text-center pb-0">
                  <h2 className="mb-0 h5">Create Account</h2>
                </div>
                <div className="card-body">
                  <form action="#">
                    <div className="form-group">
                      <label htmlFor="email">Your email</label>
                      <div className="input-group mb-4">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <span className="fas fa-envelope"></span>
                          </span>
                        </div>
                        <input
                          className="form-control"
                          id="email"
                          placeholder="example@company.com"
                          type="email"
                          aria-label="Email address"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <div className="input-group mb-4">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <span className="fas fa-unlock-alt"></span>
                          </span>
                        </div>
                        <input
                          className="form-control"
                          id="password"
                          placeholder="Password"
                          type="password"
                          aria-label="Password"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <span className="fas fa-unlock-alt"></span>
                          </span>
                        </div>
                        <input
                          className="form-control"
                          id="confirmPassword"
                          placeholder="Confirm password"
                          type="password"
                          aria-label="Confirm Password"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-check mb-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="terms"
                        required
                      />
                      <label className="form-check-label" htmlFor="terms">
                        I agree to the <a href="#">terms and conditions</a>
                      </label>
                    </div>
                    <button type="submit" className="btn btn-block btn-primary">
                      Sign in
                    </button>
                  </form>
                  <div className="d-block d-sm-flex justify-content-center align-items-center mt-4">
                    <span className="font-weight-normal">
                      Already have an account?{" "}
                      <a href="#" className="font-weight-bold">
                        Login here
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignupPage;
