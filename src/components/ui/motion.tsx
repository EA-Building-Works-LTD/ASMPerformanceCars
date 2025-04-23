"use client"

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

// Create a more complete type that includes className and all HTML div attributes
type MotionDivProps = HTMLMotionProps<"div"> & React.HTMLAttributes<HTMLDivElement>

export const MotionDiv = React.forwardRef<HTMLDivElement, MotionDivProps>(
  (props, ref) => <motion.div ref={ref} {...props} />
)
MotionDiv.displayName = "MotionDiv" 