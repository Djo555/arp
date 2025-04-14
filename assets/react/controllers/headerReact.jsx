import React, { useState, useEffect, useRef } from "react";

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const dropdownRef = useRef(null);

  const menuItems = [
    { label: "ACCUEIL", link: "/" },
    { label: "LE CABINET", link: "#" },
    {
      label: "PARTICULIERS",
      link: "#",
      isDropdown: true,
      dropdownId: "dropdown1",
      dropdownItems: [
        [
          { label: "Divorce", link: "#" },
          { label: "Garde d'enfant", link: "#" },
          { label: "Pension alimentaire", link: "#" },
        ],
        [
          { label: "Droit du travail", link: "#" },
          { label: "Enquête de moralité", link: "#" },
          { label: "Enquête de solvabilité", link: "#" },
        ],
        [{ label: "Recherches de personne disparue", link: "#" }],
      ],
    },
    {
      label: "ENTREPRISES",
      link: "#",
      isDropdown: true,
      dropdownId: "dropdown2",
      dropdownItems: [
        [
          { label: "Enquête de solvabilité", link: "#" },
          { label: "Enquête de moralité", link: "#" },
          { label: "Concurrence déloyale", link: "#" },
        ],
        [
          { label: "Surveillance du personnel", link: "#" },
          { label: "Vol en interne", link: "#" },
          { label: "Arrêt maladie abusif", link: "#" },
        ],
        [
          { label: "Due diligence", link: "#" },
          { label: "Recherche de débiteurs", link: "#" },
        ],
      ],
    },
    { label: "TARIFS", link: "#" },
    { label: "CONTACTS", link: "#" },
    { label: "ARTICLES", link: "#" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    setCurrentPath(window.location.pathname);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleDropdownClick = (dropdownId, event) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white" ref={dropdownRef}>
      <div className="container mx-auto" style={{ maxWidth: "1440px" }}>
        <a className="navbar-brand" href="#">
          <img className="logo" src="/build/images/logo1.png" alt="BenOps" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor04"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarColor04">
          <ul className="navbar-nav w-100 ms-auto justify-content-between">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`nav-item ${
                  activeDropdown === item.dropdownId ? "active" : ""
                }`}
              >
                <a
                  className={`nav-link ${
                    item.isDropdown ? "custom-dropdown-toggle" : ""
                  } ${currentPath === item.link ? "active-link" : ""}`}
                  href={item.link}
                  onClick={
                    item.isDropdown
                      ? (e) => handleDropdownClick(item.dropdownId, e)
                      : undefined
                  }
                  role={item.isDropdown ? "button" : undefined}
                  aria-haspopup={item.isDropdown ? "true" : undefined}
                  aria-expanded={
                    item.isDropdown
                      ? String(activeDropdown === item.dropdownId)
                      : undefined
                  }
                  style={currentPath === item.link ? { color: "#FF6B00" } : {}}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {menuItems
        .filter((item) => item.isDropdown)
        .map(
          (item, index) =>
            activeDropdown === item.dropdownId && (
              <ul
                key={index}
                className="custom-dropdown-menu justify-content-between flex-row active"
                id={item.dropdownId}
              >
                {item.dropdownItems.map((column, colIndex) => (
                  <div key={colIndex} className="col">
                    <ul>
                      {column.map((dropItem, itemIndex) => (
                        <li key={itemIndex}>
                          <a className="dropdown-item" href={dropItem.link}>
                            {dropItem.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </ul>
            )
        )}
    </nav>
  );
};

export default Header;