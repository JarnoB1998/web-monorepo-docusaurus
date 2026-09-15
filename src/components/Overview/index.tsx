import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

/* ---------- Kaartjes in een raster ---------- */

export function CardGrid({children}: {children: ReactNode}): ReactNode {
  return <div className={styles.cardGrid}>{children}</div>;
}

type CardProps = {
  icon?: ReactNode;
  title: ReactNode;
  children: ReactNode;
};

export function Card({icon, title, children}: CardProps): ReactNode {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        {icon && <span className={styles.cardIcon} aria-hidden="true">{icon}</span>}
        <strong>{title}</strong>
      </div>
      <div className={styles.cardBody}>{children}</div>
    </div>
  );
}

/* ---------- Stappenplan in één oogopslag ---------- */

export function StepList({children}: {children: ReactNode}): ReactNode {
  return <ol className={styles.stepList}>{children}</ol>;
}

type StepProps = {
  title: ReactNode;
  href: string;
  /** Kort label, bv. "Enkel Windows" */
  badge?: string;
  children?: ReactNode;
};

export function Step({title, href, badge, children}: StepProps): ReactNode {
  return (
    <li className={styles.step}>
      <div className={styles.stepContent}>
        <Link to={href} className={styles.stepTitle}>
          {title}
        </Link>
        {badge && <span className={styles.badge}>{badge}</span>}
        {children && <div className={styles.stepBody}>{children}</div>}
      </div>
    </li>
  );
}

/* ---------- Schema: wat draait waar? ---------- */

type BoxProps = {
  icon?: ReactNode;
  title: ReactNode;
  /** Visuele stijl van het kader */
  variant?: 'outer' | 'middle' | 'inner' | 'item' | 'remote';
  children?: ReactNode;
};

export function DiagramBox({icon, title, variant = 'item', children}: BoxProps): ReactNode {
  return (
    <div className={`${styles.box} ${styles[`box_${variant}`]}`}>
      <div className={styles.boxTitle}>
        {icon && <span aria-hidden="true">{icon} </span>}
        {title}
      </div>
      {children && <div className={styles.boxBody}>{children}</div>}
    </div>
  );
}

export function Diagram({children}: {children: ReactNode}): ReactNode {
  return <div className={styles.diagram}>{children}</div>;
}

export function DiagramArrow({label}: {label?: string}): ReactNode {
  return (
    <div className={styles.arrow} aria-hidden="true">
      <span className={styles.arrowLine}>⇄</span>
      {label && <span className={styles.arrowLabel}>{label}</span>}
    </div>
  );
}
