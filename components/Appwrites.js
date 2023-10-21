import { Client, Account, Databases, ID } from 'appwrite';

import { useState, useEffect } from 'react';
export const client = new Client();

client.setEndpoint('https://cloud.appwrite.io/v1');
client.setProject('652e6cedd1a678fb7064'); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export { ID, Query } from 'appwrite';
