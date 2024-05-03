# Project Title

CS-GY 6083 – B Principles of Database Systems Group Project

## Description

A web bank application.

SAFE (Save And Fortune Excellence) bank stores their Customers Name, Address and Account Open Date. SAFE offers three types of accounts: Checking, Savings, and Loan.

Following are the attributes for each type of account:

- CUSTOMER: Customer Name, Customer Address
- CHECKING: Acct No, Acct_Name, Address, Date Opened, Service Charge (monthly account maintenance fees)
- SAVINGS: Acct No, Acct_Name, Address, Date Opened, Interest Rate
- LOAN: Acct No, Acct_Name, Address, Date Opened, Loan Rate, Loan Amount, Loan Months, Loan Payment, Loan Type
- Loan Months represents the term of the loan, e.g. 60 months, Loan Payment represents monthly loan back payment, e.g. $600.87, Loan Type represents the type of the loan, e.g. HOME LOAN, STUDENT LOAN, PERSONAL LOAN, etc.

In addition, the business team has provided the following business rules

1. For the student loans, SAFE wants to store the name of the educational institute (University Name), Student ID, graduate/undergrade and expected graduation month and year. Many students at an educational institute may have student loan accounts with SAFE.
2. For the home loan, SAFE wants to store house-built year, home insurance account number, name & address of the insurance company, and yearly insurance premium.
3. If a customer has multiple bank accounts of different types, they have different account numbers for each type of the account.
4. A customer cannot have multiple accounts of the same account type.

## Dependencies

ReactJS + NodeJS + MySQL

## Getting Started

### Executing program

- Git pull, enter /api and /client, run following cmds on both dir:

```bash
yarn install
yarn start
```

### Create Employee Admin User

```
yarn create-admin sampleUserName samplePassword
```

## Authors

- Ziyi Huang
- Zian Yan
- Zehao Li
