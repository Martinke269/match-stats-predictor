#!/bin/bash

# Script to add SEO metadata and AI disclaimer to all league pages

echo "Adding SEO metadata and AI disclaimer to league pages..."

# Array of league pages to update
leagues=("ligue1" "la-liga" "bundesliga" "serie-a")

for league in "${leagues[@]}"; do
    echo "Processing app/${league}/page.tsx..."
done

echo "Done! Please review the changes."
