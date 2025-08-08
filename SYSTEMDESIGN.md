# 🌓 Ailena Test Backend – System Design Overview

This document outlines the system architecture and design decisions for the **Ailena Test Backend API**. The system is a modular, scalable Node.js backend designed to handle user authentication, wallet integration (mocked), real-time messaging, and call logging.

---

## 🌐 High-Level Architecture

```text
                  +-----------+------------+
                  |      API Gateway       |
                  |    (Express Server)    |
                  +-----------+------------+
                              |
    +-------------------------+--------------------------+
    |                        |                          |
    ▼                        ▼                          ▼
Auth Service         Wallet Service (Mocked)       WebSocket Server
(Signup/Login)       (OnePipe Integration)         (Socket.IO for messaging)
    |                        |                          |
    ▼                        ▼                          ▼
Prisma ORM         Mock Wallet Logic           Socket Events Handler
    |                        |                          |
    +------------+-----------+                          |
    |                                               +----+----+
    |                                               | Call Log |
    |                                               | Service  |
    |                                               +----+----+
    |                                                    |
    +-----------------------------+----------------------+
                                  |
                           PostgreSQL Database

```
