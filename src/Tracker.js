import React from "react";
import { withTracker } from "ga-4-react";
import styles from './styles.module.scss'

const track = (WrappedComponent) => {
  const Tracker = withTracker(props => JSON.stringify(props))
  const HOC = (props) => {
    return (
        <>
          <div className={styles.wrapper}>
            <Tracker 
              path={props.location.pathname}
              gaCode={process.env.REACT_APP_GOOGLE_ANALYTICS_ID}
            />
          </div>
          <WrappedComponent {...props} />
        </>
    );
  };
  return HOC;
};

export {
  track,
}