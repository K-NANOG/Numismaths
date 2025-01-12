import React from "react";
import "../index.css"; // Import your custom CSS styles here

const LoginPage: React.FC = () => {
  return (
    <main>
      <section className="min-vh-100 d-flex bg-primary align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="card bg-primary shadow-soft border-light p-4">
                <div className="card-header text-center pb-0">
                  <h2 className="mb-0 h5">Login</h2>
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
                    <button type="submit" className="btn btn-block btn-primary">
                      Login
                    </button>
                  </form>
                  <div className="d-block d-sm-flex justify-content-center align-items-center mt-4">
                    <span className="font-weight-normal">
                      Don’t have an account?{" "}
                      <a href="#" className="font-weight-bold">
                        Sign up here
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

export default LoginPage;
