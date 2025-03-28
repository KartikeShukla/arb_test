"use client"

import React, { ReactNode, forwardRef, ButtonHTMLAttributes } from "react"

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The content of the button
   */
  children: ReactNode
  
  /**
   * Descriptive label for screen readers (if different from visible text)
   */
  ariaLabel?: string
  
  /**
   * ID of the element that describes this button
   */
  ariaDescribedBy?: string
  
  /**
   * Whether the button controls an expanded element
   */
  ariaExpanded?: boolean
  
  /**
   * Whether the button has a popup
   */
  ariaHasPopup?: boolean | "menu" | "listbox" | "tree" | "grid" | "dialog"
  
  /**
   * Whether the button controls a pressed/selected state
   */
  ariaPressed?: boolean
  
  /**
   * Element ID that this button controls
   */
  ariaControls?: string
  
  /**
   * Whether this button is currently busy/processing an action
   */
  ariaBusy?: boolean
  
  /**
   * Custom CSS class
   */
  className?: string
}

/**
 * An accessible button component that properly handles ARIA attributes
 * for better screen reader support and keyboard navigation
 */
export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      children,
      ariaLabel,
      ariaDescribedBy,
      ariaExpanded,
      ariaHasPopup,
      ariaPressed,
      ariaControls,
      ariaBusy,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={className}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-expanded={ariaExpanded}
        aria-haspopup={ariaHasPopup}
        aria-pressed={ariaPressed}
        aria-controls={ariaControls}
        aria-busy={ariaBusy}
        {...props}
      >
        {children}
      </button>
    )
  }
)

AccessibleButton.displayName = "AccessibleButton"

interface AccessibleTableProps {
  /**
   * Table caption for screen readers
   */
  caption: string
  
  /**
   * Whether to visually hide the caption (still available to screen readers)
   */
  hideCaption?: boolean
  
  /**
   * Table content (thead, tbody, etc.)
   */
  children: ReactNode
  
  /**
   * Custom CSS class
   */
  className?: string
  
  /**
   * Additional props for the table element
   */
  tableProps?: React.TableHTMLAttributes<HTMLTableElement>
}

/**
 * An accessible table component that properly handles captions and ARIA attributes
 * for better screen reader support
 */
export const AccessibleTable = forwardRef<HTMLTableElement, AccessibleTableProps>(
  (
    {
      caption,
      hideCaption = false,
      children,
      className,
      tableProps,
      ...props
    },
    ref
  ) => {
    return (
      <table
        ref={ref}
        className={className}
        role="table"
        {...tableProps}
        {...props}
      >
        <caption className={hideCaption ? "sr-only" : undefined}>
          {caption}
        </caption>
        {children}
      </table>
    )
  }
)

AccessibleTable.displayName = "AccessibleTable"

interface VisuallyHiddenProps {
  /**
   * Content that should be hidden visually but available to screen readers
   */
  children: ReactNode
}

/**
 * A utility component that hides content visually while keeping it available to screen readers
 */
export const VisuallyHidden = ({ children }: VisuallyHiddenProps) => {
  return (
    <span className="sr-only">
      {children}
    </span>
  )
}

interface AccessibleLabelProps {
  /**
   * The content of the label
   */
  children: ReactNode
  
  /**
   * The ID of the element this label is for
   */
  htmlFor: string
  
  /**
   * Whether this field is required
   */
  required?: boolean
  
  /**
   * Custom CSS class
   */
  className?: string
}

/**
 * An accessible label component that properly indicates required fields
 */
export const AccessibleLabel = forwardRef<HTMLLabelElement, AccessibleLabelProps>(
  (
    {
      children,
      htmlFor,
      required = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={className}
        {...props}
      >
        {children}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">*</span>
        )}
        {required && (
          <span className="sr-only">(required)</span>
        )}
      </label>
    )
  }
)

AccessibleLabel.displayName = "AccessibleLabel"

/**
 * Utility function to generate a unique ID for accessibility purposes
 */
export const generateAccessibleId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
} 