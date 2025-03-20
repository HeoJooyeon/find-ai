# 🔍 FindAI

FindAI is a personal project built with **React + Vite** and powered by the **OpenAI API**.  
It provides AI-powered utilities to enhance productivity and automate tasks.

## 🚀 Features

- ✨ **AI-Powered Utilities**: Leverage OpenAI's powerful AI models.
- ⚡ **Built with React + Vite**: Fast and optimized development environment.
- 🎨 **Modern UI**: Clean and user-friendly interface.
- 🌐 **Fast & Lightweight**: Optimized for performance.
- 💾 **Local Storage Management**: Save and delete data efficiently using local storage.

## 🛠️ Tech Stack

- **Frontend**: React, Vite
- **Backend**: OpenAI API

## 📦 Installation

To set up the project locally, follow these steps:

```sh
# Clone the repository
git clone https://github.com/HeoJooyeon/FindAI.git

# Navigate to the project folder
cd FindAI

# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install
```

### 🔑 Setting Up OpenAI API Key

To use OpenAI's API, you need to obtain a **Secret Key** from OpenAI and store it in an `.env` file.

1. Go to [OpenAI API Keys](https://platform.openai.com/signup/) and sign in (or create an account).
2. Navigate to **API Keys** in your OpenAI account settings.
3. Click **Create a new secret key** and copy the generated key.
4. In the **frontend** folder of this project, create a `.env` file and add the following line:

   ```sh
   VITE_OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXX
   ```

   _(Replace `sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXX` with your actual OpenAI API key.)_

5. Start the development server:

   ```sh
   npm run dev
   ```

> **Note**: Keep your API key secure and do not share it publicly.

## 📌 Menu Overview

1. **Query Maker (Generate Sample Queries)**: Query Maker generates INSERT statements based on the provided table information and saves query data using local storage.
2. **Scan Image (Image Search)**: Scan Image analyzes a photo and provides a description of its contents.
3. **Encoder Tool (Encoding Utility)**: Encoder Tool encodes URL and Base64 values and allows users to save encoded data in local storage.
4. **Color Mixer (Color Combination)**: Color Mixer helps you find the perfect color by blending different shades and stores your preferred combinations in local storage.
5. **JSON Repair (JSON Fixing)**: JSON Repair analyzes and corrects structural errors in JSON data, with an option to save the fixed JSON in local storage.

---

# 🔍 FindAI

FindAI는 **React + Vite**로 개발된 개인 프로젝트이며, **OpenAI API**를 활용합니다.  
AI 기반 유틸리티를 제공하여 생산성을 향상시키고 작업을 자동화할 수 있도록 합니다.

## 🚀 주요 기능

- ✨ **AI 기반 유틸리티**: OpenAI의 강력한 AI 모델을 활용
- ⚡ **React + Vite 기반 개발**: 빠르고 최적화된 개발 환경
- 🎨 **모던한 UI**: 깔끔하고 사용자 친화적인 인터페이스
- 🌐 **빠르고 가벼운 성능**: 최적화된 퍼포먼스 제공
- 💾 **로컬 스토리지 관리**: 데이터를 효율적으로 저장 및 삭제

## 🛠️ 기술 스택

- **프론트엔드**: React, Vite
- **백엔드**: OpenAI API

## 📦 설치 방법

프로젝트를 로컬에서 실행하려면 아래 단계를 따라 주세요:

```sh
# 저장소 클론하기
git clone https://github.com/HeoJooyeon/FindAI.git

# 프로젝트 폴더로 이동
cd FindAI

# 프론트엔드 폴더로 이동
cd frontend

# 필요한 패키지 설치
npm install
```

### 🔑 OpenAI API 키 설정

OpenAI API를 사용하려면 OpenAI에서 **비밀 키(Secret Key)** 를 발급받아 `.env` 파일에 저장해야 합니다.

1. [OpenAI API Keys](https://platform.openai.com/signup/)에서 계정을 생성하거나 로그인하세요.
2. OpenAI 계정 설정에서 **API Keys** 메뉴로 이동하세요.
3. **새로운 비밀 키 생성(Create a new secret key)** 버튼을 클릭하고 생성된 키를 복사하세요.
4. **frontend** 폴더 내에 `.env` 파일을 생성하고 아래 내용을 추가하세요.

   ```sh
   VITE_OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXX
   ```

   _(`sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXX`를 실제 OpenAI API 키로 변경하세요.)_

5. 개발 서버 실행:

   ```sh
   npm run dev
   ```

> **주의**: API 키는 보안상 중요하므로 외부에 공유하지 마세요.

## 📌 메뉴 개요

1. **쿼리 메이커 (Query Maker - 샘플 쿼리 생성)**: 테이블 정보를 기반으로 INSERT 문을 생성하고, 생성된 쿼리를 로컬 스토리지에 저장합니다.
2. **이미지 스캔 (Scan Image - 이미지 검색)**: 사진을 분석하여 이미지의 내용을 설명해 줍니다.
3. **인코더 도구 (Encoder Tool - 인코딩 유틸리티)**: URL 및 Base64 값을 인코딩하고, 변환된 데이터를 로컬 스토리지에 저장할 수 있습니다.
4. **컬러 믹서 (Color Mixer - 색상 조합)**: 다양한 색상을 혼합하여 원하는 색상을 찾고, 조합을 로컬 스토리지에 저장할 수 있습니다.
5. **JSON 복구 (JSON Repair - JSON 오류 수정)**: JSON 데이터를 분석하여 구조적 오류를 수정하고, 수정된 JSON을 로컬 스토리지에 저장할 수 있습니다.

---
