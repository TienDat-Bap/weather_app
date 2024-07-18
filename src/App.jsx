import axios from "axios";
import { useState, useEffect } from "react";
import moment from "moment-timezone";

function App() {
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (lat, lon, city) => {
    try {
      setLoading(true);
      setError(null);

      let apiURL = '';
      if (city) {
        apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_APP_ID}`;
      } else {
        apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_APP_ID}`;
      }

      const { data } = await axios.get(apiURL);
      console.log(data);

      const timezoneOffset = data.timezone;
      const localTime = moment().utcOffset(timezoneOffset / 60).format("DD/MM/YYYY, h:mm:ss A");

      setWeatherData({
        name: data.name,
        visibility: (data.visibility / 1000) + ' km',
        wind: data.wind.speed + ' m/s',
        humidity: data.main.humidity + '%',
        value: Math.round(data.main.temp - 273.15),
        shortdesc: data.weather[0] ? data.weather[0].main : null,
        time: localTime,
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Không thể lấy dữ liệu thời tiết. Vui lòng thử lại.");
      console.log(error);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        search(latitude, longitude);
      },
      (error) => {
        setError("Không thể lấy vị trí hiện tại của bạn. Hiển thị thời tiết mặc định tại London.");
        search(null, null, "london");
      }
    );
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const city = event.target.elements.city.value;
    search(null, null, city);
  };

  return (
    <>
      <section className="weather-app py-[10%] ">
        <div className="weather shadow-2xl w-[25%] lg:h-[100%] pt-[1%] px-3 rounded-lg ">
          <form className="search flex items-center justify-center" onSubmit={handleSubmit}>
            <input
              type="text"
              name="city"
              placeholder="Search"
              className="border-2 px-3 rounded-full w-[80%] mr-[2%]"
              required
            />
            <button
              type="submit"
              className="bg-white border-2 hover:border-black hover:bg-black hover:text-white px-2 rounded-full pt-1 text-[15px]"
            >
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </form>
          {loading && (
            <p className="text-center text-white mt-4">Đang tải...</p>
          )}
          {error && (
            <p className="text-red-500 text-center mt-4">{error}</p>
          )}
          {weatherData.name && !loading && (
            <div className="content">
              <h1 className="capital lg:mt-[8%] text-center lg:text-[30px] mt-[4%] text-[20px] font-semibold text-white">
                <span className="city">{weatherData.name}</span>
              </h1>
              <div className="time text-[12px] text-center text-white">
                {weatherData.time}
              </div>
              <div className="temperature text-center mt-[5%] lg:text-[57px] text-[30px] border w-[70%] shadow-sm shadow-white rounded-lg text-white border-white">
                <span className="value">
                  {weatherData.value} <sup>0</sup>C
                </span>
              </div>
              <div className="short-desc mt-[8%] text-center lg:text-[32px] text-[20px] font-semibold text-white">
                {weatherData.shortdesc}
              </div>
              <div className="more-desc flex justify-between items-center mt-[13%] text-white">
                <div className="visibility text-center">
                  <i className="fa-regular fa-eye" />
                  <span className="block text-[12px] lg:text-[16px]">{weatherData.visibility}</span>
                </div>
                <div className="wind text-center">
                  <i className="fa-solid fa-wind" />
                  <span className="block text-[12px] lg:text-[16px]">{weatherData.wind}</span>
                </div>
                <div className="humidity text-center">
                  <i className="fa-regular fa-sun" />
                  <span className="block text-[12px] lg:text-[16px]">{weatherData.humidity}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default App;
