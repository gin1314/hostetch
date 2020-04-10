import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';

export default function Home() {
  return (
    <div className={styles.container} data-tid="container">
      <Link to={routes.HOSTEDITOR}>To Host Editor</Link>
    </div>
  );
}
