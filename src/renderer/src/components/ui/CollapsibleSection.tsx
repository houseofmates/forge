import React, { useState } from 'react'
import { makeStyles, tokens, Text } from '@fluentui/react-components'
import { ChevronDownRegular, ChevronRightRegular } from '@fluentui/react-icons'

const useStyles = makeStyles({
  container: {
    backgroundColor: '#0a0a0a',
    borderRadius: '8px',
    border: '1px solid #252525',
    overflow: 'hidden',
    marginBottom: tokens.spacingVerticalM,
    transition: 'border-color 200ms cubic-bezier(0.33, 1, 0.68, 1)'
  },
  containerExpanded: {
    borderBottomColor: '#f6b012',
    borderTopColor: '#f6b012',
    borderLeftColor: '#f6b012',
    borderRightColor: '#f6b012'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    cursor: 'pointer',
    backgroundColor: '#0a0a0a',
    transition: 'background-color 200ms cubic-bezier(0.33, 1, 0.68, 1)',
    ':hover': {
      backgroundColor: '#111111'
    }
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS
  },
  title: {
    color: '#f6b012',
    fontWeight: 500
  },
  subtitle: {
    color: '#3c9fdd',
    fontSize: '12px'
  },
  chevron: {
    color: '#f6b012',
    transition: 'transform 200ms cubic-bezier(0.33, 1, 0.68, 1)'
  },
  content: {
    padding: `0 ${tokens.spacingHorizontalL} ${tokens.spacingVerticalL}`,
    borderTop: '1px solid #252525',
    backgroundColor: '#050505'
  },
  contentHidden: {
    display: 'none'
  }
})

interface CollapsibleSectionProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  defaultExpanded?: boolean
  children: React.ReactNode
  actions?: React.ReactNode
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  subtitle,
  icon,
  defaultExpanded = false,
  children,
  actions
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const styles = useStyles()

  return (
    <div className={`${styles.container} ${isExpanded ? styles.containerExpanded : ''}`}>
      <div
        className={styles.header}
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsExpanded(!isExpanded)
          }
        }}
      >
        <div className={styles.headerLeft}>
          {icon}
          <div>
            <Text className={styles.title}>{title}</Text>
            {subtitle && <Text className={styles.subtitle}> • {subtitle}</Text>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {actions && <div onClick={(e) => e.stopPropagation()}>{actions}</div>}
          {isExpanded ? (
            <ChevronDownRegular className={styles.chevron} />
          ) : (
            <ChevronRightRegular className={styles.chevron} />
          )}
        </div>
      </div>
      <div className={`${styles.content} ${!isExpanded ? styles.contentHidden : ''}`}>
        {children}
      </div>
    </div>
  )
}

export default CollapsibleSection
