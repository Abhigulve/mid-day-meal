import axios, { AxiosInstance, AxiosResponse } from 'axios';

const BASE_URL = 'http://localhost:8080/api'; // Change this to your backend URL

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.api.defaults.headers.common['Authorization'];
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<AxiosResponse> {
    return this.api.post('/auth/login', { username, password });
  }

  // School endpoints
  async getSchools(): Promise<AxiosResponse> {
    return this.api.get('/schools');
  }

  async getSchoolById(id: number): Promise<AxiosResponse> {
    return this.api.get(`/schools/${id}`);
  }

  async createSchool(school: any): Promise<AxiosResponse> {
    return this.api.post('/schools', school);
  }

  async updateSchool(id: number, school: any): Promise<AxiosResponse> {
    return this.api.put(`/schools/${id}`, school);
  }

  async searchSchools(query: string): Promise<AxiosResponse> {
    return this.api.get(`/schools/search?query=${query}`);
  }

  // Menu endpoints
  async getMenus(): Promise<AxiosResponse> {
    return this.api.get('/menus');
  }

  async getCurrentWeekMenus(): Promise<AxiosResponse> {
    return this.api.get('/menus/current-week');
  }

  async getCurrentMonthMenus(): Promise<AxiosResponse> {
    return this.api.get('/menus/current-month');
  }

  async getMenuById(id: number): Promise<AxiosResponse> {
    return this.api.get(`/menus/${id}`);
  }

  async createMenu(menu: any): Promise<AxiosResponse> {
    return this.api.post('/menus', menu);
  }

  // Meal Record endpoints
  async getMealRecords(): Promise<AxiosResponse> {
    return this.api.get('/meal-records');
  }

  async getTodaysMealRecords(): Promise<AxiosResponse> {
    return this.api.get('/meal-records/today');
  }

  async getMealRecordsBySchool(schoolId: number, startDate: string, endDate: string): Promise<AxiosResponse> {
    return this.api.get(`/meal-records/school/${schoolId}?startDate=${startDate}&endDate=${endDate}`);
  }

  async createMealRecord(mealRecord: any): Promise<AxiosResponse> {
    return this.api.post('/meal-records', mealRecord);
  }

  async updateMealRecord(id: number, mealRecord: any): Promise<AxiosResponse> {
    return this.api.put(`/meal-records/${id}`, mealRecord);
  }

  // Food Item endpoints
  async getFoodItems(): Promise<AxiosResponse> {
    return this.api.get('/food-items');
  }

  async searchFoodItems(query: string): Promise<AxiosResponse> {
    return this.api.get(`/food-items/search?query=${query}`);
  }

  // Upload endpoint
  async uploadFile(file: FormData): Promise<AxiosResponse> {
    return this.api.post('/upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export const apiService = new ApiService();