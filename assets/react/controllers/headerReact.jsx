import React, { useState, useEffect, useRef } from "react";

const Header = ({routes}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const dropdownRef = useRef(null);

  const menuItems = [
    { label: "ACCUEIL", link:routes.accueil },
    { label: "LE CABINET", link:routes.cabinet },
    {
      label: "PARTICULIERS",
      isDropdown: true,
      dropdownId: "dropdown1",
      dropdownItems: [
        [
          { label: "Divorce conflictuel", link:routes.particuliers.divorce},
          { label: "Garde d’enfant", link:routes.particuliers.garde },
          { label: "Pension alimentaire", link:routes.particuliers.pension },
        ],
        [
          { label: "Violations du droit du travail", link:routes.particuliers.travail },
          { label: "Enquête de moralité", link:routes.particuliers.morale },
          { label: "Enquête de solvabilité", link:routes.particuliers.solvable },
        ],
        [{ label: "Personnes disparues ou introuvables", link:routes.particuliers.disparue }],
      ],
    },
    {
      label: "ENTREPRISES",
      isDropdown: true,
      dropdownId: "dropdown2",
      dropdownItems: [
        [
          { label: "Analyse des antécédents", link:routes.entreprises.antecedent },
          { label: "Suspicion d’arrêt maladie abusif", link:routes.entreprises.maladie },
          { label: "Détection de concurrence déloyale", link:routes.entreprises.concurrence },
        ],
        [
          { label: "Suspicion du personnel", link:routes.entreprises.personnel },
          { label: "Détection des vols internes", link:routes.entreprises.vols},
          { label: "Opérations de client mystère", link:routes.entreprises.mystere},
        ],
        [
          { label: "Protection contre l’espionnage industriel", link:routes.entreprises.espion},
          { label: "Conseils en sécurité", link:routes.entreprises.securite},
        ],
      ],
    },
    { label: "TARIFS", link:routes.tarif },
    { label: "CONTACTS", link:routes.contact },
    { label: "ARTICLES", link:routes.article },
  ];

  const isDropdownItemActive = (item) => {
    if (!item.isDropdown) return false;
    return item.dropdownItems.some(column => 
      column.some(dropItem => dropItem.link === currentPath)
    );
  };

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
                  style={(currentPath === item.link || isDropdownItemActive(item)) ? { color: "#FF6B00" } : {}}
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
                <ul className="col"></ul>
                {item.dropdownItems.map((column, colIndex) => (
                  <ul key={colIndex} className="col">
                      {column.map((dropItem, itemIndex) => (
                        <li key={itemIndex}>
                          <a className="dropdown-item" href={dropItem.link}>
                            {dropItem.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                ))}
                <ul className="col"></ul>
              </ul>
            )
        )}
    </nav>
  );
};

export default Header;