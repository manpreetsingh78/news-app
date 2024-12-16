import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  listPreferences,
  getUserPreferences,
  updateUserPreferences,
} from "../store/preferencesSlice";
import Loader from "../components/Loader";
import "./PreferencesPage.css";
import { Stepper, StepLabel, Step, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";

export default function PreferencesPage() {
  const dispatch = useDispatch();
  const { sources, categories, authors, userPreferences, loading, error } =
    useSelector((state) => state.preferences);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [visibleItems, setVisibleItems] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(listPreferences());
    dispatch(getUserPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (userPreferences.length > 0) {
      const userSources = userPreferences
        .filter((pref) => pref.source_id)
        .map((p) => p.source_id);
      const userCategories = userPreferences
        .filter((pref) => pref.category_id)
        .map((p) => p.category_id);
      const userAuthors = userPreferences
        .filter((pref) => pref.author_id)
        .map((p) => p.author_id);

      setSelectedSources(userSources);
      setSelectedCategories(userCategories);
      setSelectedAuthors(userAuthors);
    }
  }, [userPreferences]);

  const handleSelectionChange = (id, type) => {
    if (type === "source") {
      setSelectedSources((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    } else if (type === "category") {
      setSelectedCategories((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    } else if (type === "author") {
      setSelectedAuthors((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateUserPreferences({
        sources: selectedSources,
        categories: selectedCategories,
        authors: selectedAuthors,
      })
    );
  };

  const handleNextStep = () => {
    setSearchQuery("");
    setVisibleItems(10);
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setSearchQuery("");
    setVisibleItems(10);
    setCurrentStep((prev) => prev - 1);
  };

  const handleShowMore = () => {
    setVisibleItems((prev) => prev + 10);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const steps = ["Select Sources", "Select Categories", "Select Authors"];

  const renderStepContent = () => {
    const data =
      currentStep === 1 ? sources : currentStep === 2 ? categories : authors;
    const selectedData =
      currentStep === 1
        ? selectedSources
        : currentStep === 2
          ? selectedCategories
          : selectedAuthors;
    const type =
      currentStep === 1 ? "source" : currentStep === 2 ? "category" : "author";

    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery)
    );

    const isAllSelected =
      filteredData.length > 0 &&
      filteredData.every((item) => selectedData.includes(item.id));

    const handleToggleSelectAll = () => {
      if (isAllSelected) {
        if (type === "source") setSelectedSources([]);
        else if (type === "category") setSelectedCategories([]);
        else if (type === "author") setSelectedAuthors([]);
      } else {
        const allIds = filteredData.map((item) => item.id);
        if (type === "source") setSelectedSources(allIds);
        else if (type === "category") setSelectedCategories(allIds);
        else if (type === "author") setSelectedAuthors(allIds);
      }
    };

    return (
      <>
        <div className="InputContainer mb-3">
          <input
            type="text"
            className="input"
            id={`search-${type}`}
            placeholder={`Search ${type}s...`}
            value={searchQuery}
            onChange={handleSearch}
          />
          <label className="labelforsearch" htmlFor={`search-${type}`}>
            <svg className="searchIcon" viewBox="0 0 512 512">
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
            </svg>
          </label>
        </div>
        { }
        <div className="mb-3 d-flex justify-content-start">
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: isAllSelected ? "#F44336" : "#5C88C4" }}
            onClick={handleToggleSelectAll}
          >
            {isAllSelected ? "Deselect All" : "Select All"}
          </Button>
        </div>
        <div className="selection-grid">
          {filteredData.slice(0, visibleItems).map((item) => (
            <div
              key={item.id}
              className={`selection-card ${selectedData.includes(item.id) ? "selected" : ""
                }`}
              onClick={() => handleSelectionChange(item.id, type)}
            >
              {selectedData.includes(item.id) && (
                <CheckCircleIcon className="check-icon" />
              )}
              {item.name}
            </div>
          ))}
        </div>
        {filteredData.length > visibleItems && (
          <Button
            className="mt-3"
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#5C88C4",
            }}
            onClick={handleShowMore}
            startIcon={<ExpandCircleDownIcon />}
          >
            Show More
          </Button>
        )}
      </>
    );
  };


  if (loading && currentStep === 1) return <Loader />;

  return (
    <div className="main-pref">
      <div className="pref">
        <div className="card preferences-card">
          <div className="card-body">
            <div className="text-center mb-4">
              <h3
                style={{
                  color: "#0A3981",
                  textDecoration: "none",
                  fontWeight: "700",
                }}
              >
                {currentStep === 1
                  ? "Sources"
                  : currentStep === 2
                    ? "Categories"
                    : "Authors"}{" "}
                Preferences
              </h3>
              <Stepper
                activeStep={currentStep - 1}
                alternativeLabel
                sx={{
                  color: "#3ABEF9",
                }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              {renderStepContent()}

              <div className="d-flex justify-content-between mt-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="bton"
                    onClick={handlePreviousStep}
                  >
                    Back
                    <div className="hoverEffect">
                      <div></div>
                    </div>
                  </button>
                )}
                {currentStep < 3 && (
                  <button
                    type="button"
                    className="bton"
                    onClick={handleNextStep}
                  >
                    Next
                    <div className="hoverEffect">
                      <div></div>
                    </div>
                  </button>
                )}
                {currentStep === 3 && (
                  <button type="submit" className="bton">
                    Save Preferences
                    <div className="hoverEffect">
                      <div></div>
                    </div>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
