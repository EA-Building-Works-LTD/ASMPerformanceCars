"use client"

import React, { useState, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { PortableText } from '@portabletext/react'
import { PoundSterling, Calendar, Percent, Calculator } from 'lucide-react'
import { portableTextComponents } from '@/lib/portableTextComponents'

interface CalculatorSettings {
  defaultRate: number
  minLoanAmount: number
  maxLoanAmount: number
  minTerm: number
  maxTerm: number
  disclaimer: any
}

interface FinanceCalculatorProps {
  title: string
  subtitle?: string
  settings: CalculatorSettings
}

export const FinanceCalculator: React.FC<FinanceCalculatorProps> = ({
  title,
  subtitle,
  settings
}) => {
  const [loanAmount, setLoanAmount] = useState(settings.minLoanAmount + (settings.maxLoanAmount - settings.minLoanAmount) / 2)
  const [interestRate, setInterestRate] = useState(settings.defaultRate)
  const [termMonths, setTermMonths] = useState(settings.minTerm + (settings.maxTerm - settings.minTerm) / 2)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalPayable, setTotalPayable] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)

  useEffect(() => {
    calculatePayments()
  }, [loanAmount, interestRate, termMonths])

  const calculatePayments = () => {
    // Convert annual interest rate to monthly
    const monthlyRate = interestRate / 100 / 12
    
    // Calculate monthly payment using the formula: P = L[r(1+r)^n]/[(1+r)^n-1]
    // where P = monthly payment, L = loan amount, r = monthly interest rate, n = loan term in months
    if (monthlyRate === 0) {
      // If interest rate is 0, simple division
      const payment = loanAmount / termMonths
      setMonthlyPayment(payment)
      setTotalPayable(loanAmount)
      setTotalInterest(0)
    } else {
      const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
      setMonthlyPayment(payment)
      setTotalPayable(payment * termMonths)
      setTotalInterest(payment * termMonths - loanAmount)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 my-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Loan Amount Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 font-medium flex items-center">
                <PoundSterling className="w-5 h-5 mr-2 text-red-600" />
                Loan Amount
              </label>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-800 font-medium">
                {formatCurrency(loanAmount)}
              </span>
            </div>
            <Slider
              value={[loanAmount]}
              min={settings.minLoanAmount}
              max={settings.maxLoanAmount}
              step={500}
              onValueChange={(value) => setLoanAmount(value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{formatCurrency(settings.minLoanAmount)}</span>
              <span>{formatCurrency(settings.maxLoanAmount)}</span>
            </div>
          </div>
          
          {/* Interest Rate Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 font-medium flex items-center">
                <Percent className="w-5 h-5 mr-2 text-red-600" />
                Interest Rate
              </label>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-800 font-medium">
                {interestRate.toFixed(1)}%
              </span>
            </div>
            <Slider
              value={[interestRate]}
              min={2}
              max={20}
              step={0.1}
              onValueChange={(value) => setInterestRate(value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>2.0%</span>
              <span>20.0%</span>
            </div>
          </div>
          
          {/* Term Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 font-medium flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-red-600" />
                Loan Term
              </label>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-800 font-medium">
                {termMonths} months ({Math.floor(termMonths / 12)} years {termMonths % 12} months)
              </span>
            </div>
            <Slider
              value={[termMonths]}
              min={settings.minTerm}
              max={settings.maxTerm}
              step={1}
              onValueChange={(value) => setTermMonths(value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{settings.minTerm} months</span>
              <span>{settings.maxTerm} months</span>
            </div>
          </div>
        </div>
        
        {/* Results */}
        <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-center">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-12 h-12 text-red-600" />
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-gray-500 text-sm mb-1">Estimated Monthly Payment</h3>
            <div className="text-4xl font-bold text-gray-900">{formatCurrency(monthlyPayment)}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg text-center">
              <h4 className="text-gray-500 text-sm mb-1">Total Payable</h4>
              <div className="text-xl font-semibold text-gray-900">{formatCurrency(totalPayable)}</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <h4 className="text-gray-500 text-sm mb-1">Total Interest</h4>
              <div className="text-xl font-semibold text-gray-900">{formatCurrency(totalInterest)}</div>
            </div>
          </div>
          
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-full"
          >
            Get in Touch
          </Button>
          
          {settings.disclaimer && (
            <div className="mt-4 text-xs text-gray-500 max-w-lg mx-auto">
              <PortableText value={settings.disclaimer} components={portableTextComponents} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 