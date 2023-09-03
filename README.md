# UA-Stormworks
Переклад для гри Stormworks: Build and Rescue

Переклад закинутий автором (Мною), бо я лінивий і мені скучно це перекладати, тому ви можете перекладати гру за мене, а я потім це вивантажу в майстерню.

# Деякі правила:

Якщо в початковій назів всі слова з великої - пишіть в перекладі теж з великої, не питайте чому, виключення сполучники по типу "або", "та", тощо.

# Quick translation guide

## Prerequisites
### Node.js
Install Node.js from [here](https://nodejs.org/en/download/).

### Git
Install Git from [here](https://git-scm.com/downloads).

### Azure Subscription
1. Create a free Azure account [here](https://azure.microsoft.com/en-us/free/).
2. Create a free Azure Translator Text subscription [here](https://learn.microsoft.com/uk-ua/azure/ai-services/translator/translator-overview).
3. Get `key`, `location` and `endpoint` from the Azure portal.
4. Create a `.env` file (based on `.env.example`) in the repository folder and fill it with the key, location and endpoint.


## Setup
1. Clone this repository.
2. Run `npm install` in the repository folder.

## Usage
1. Run `npm run start` in the repository folder.
2. Wait for the script to finish.
3. Check the `out` folder for the translated file (it will be named `Ukrainian.tsv`).
4. Copy the contents from out to the root of the repository.
5. Commit and create pr to the repository. Feel what are you better than Google Translate.



# Manual translation guide

## Prerequisites
Nothing


## How
1. Open `Ukrainian.tsv` file.
2. Translate the text in the fourth column (the one with `en` in the third column that you need to translate to Ukrainian).
3. Save the file.
4. Commit and create pr to the repository. Feel what are you definitely better than Google Translate and Azure Translator Text.
