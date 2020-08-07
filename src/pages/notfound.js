import React from 'react';
import { Link } from '@reach/router';

export default function notfound() {
  return (
    <>
      <div className="error-page vh-100 d-flex justify-content-center text-center">
        <div className="my-auto">
          <h2>404</h2>
          <p>Oops something went wrong</p>
          <Link to="/" className="btn">
            Back to Home <i className="icon ion-md-home"></i>
          </Link>
        </div>
      </div>
    </>
  );
}
