
export async function askAi(path: string, data: any): Promise<any> {
  try {
    const response = await fetch(import.meta.env.VITE_N8N_URL + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'N8N_KEY': import.meta.env.VITE_N8N_KEY || '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in askAi:', error);
    throw error;
  }
}